// End-to-end check of the API (friends, invitations, lists, surprise ideas).
// Run against the docker compose stack: node claude-scripts/smoke-test.mjs
const API = process.env.API_URL ?? 'http://localhost:3000/api';
const suffix = Date.now().toString(36);
let failures = 0;

function check(label, condition, details) {
    if (condition) {
        console.log(`OK   ${label}`);
    } else {
        failures++;
        console.log(`FAIL ${label}`, details === undefined ? '' : JSON.stringify(details));
    }
}

async function call(method, path, token, body) {
    const res = await fetch(API + path, {
        method,
        headers: {
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
        data = await res.json();
    } catch {
        // empty body
    }
    return { status: res.status, data };
}

async function register(name, email) {
    const res = await call('POST', '/auth/register', null, { name, email, password: 'secret123' });
    check(`register ${name}`, res.status === 201, res);
    return res.data;
}

const alice = await register(`alice_${suffix}`, `alice_${suffix}@example.com`);
const bob = await register(`bob_${suffix}`);
const carol = await register(`carol_${suffix}`);

// Auth
check('duplicate username -> 409', (await call('POST', '/auth/register', null, { name: alice.name, password: 'x1234' })).status === 409);
check('a name contained in another one is accepted', (await call('POST', '/auth/register', null, { name: `lice_${suffix}`, password: 'x1234' })).status === 201);
check('no token -> 401', (await call('GET', '/list/lists')).status === 401);
check('bad token -> 401', (await call('GET', '/list/lists', 'nope')).status === 401);

// Default list created at registration, only one even with parallel calls
const [l1, l2] = await Promise.all([call('GET', '/list/lists', alice.token), call('GET', '/list/lists', alice.token)]);
check('alice has exactly one default list', l1.status === 200 && l1.data.length === 1 && l2.data.length === 1 && l1.data[0].label === 'Tous', l1);
const aliceList = l1.data[0];

// Items on my own list (POST without body used to fail with a JSON content-type)
const item = await call('POST', `/kdo/me/create/${aliceList.id}`, alice.token);
check('create my item', item.status === 201 && item.data.authorId === alice.id, item);
check('rename my item', (await call('PATCH', `/kdo/updateLabel/${item.data.id}`, alice.token, { label: 'Vélo' })).status === 200);
check('empty label allowed', (await call('PATCH', `/kdo/updateLabel/${item.data.id}`, alice.token, { label: '' })).status === 200);
await call('PATCH', `/kdo/updateLabel/${item.data.id}`, alice.token, { label: 'Vélo' });
const item2 = await call('POST', `/kdo/me/create/${aliceList.id}`, alice.token);
await call('PATCH', `/kdo/updateLabel/${item2.data.id}`, alice.token, { label: 'Livre' });
check('check my item', (await call('PATCH', `/kdo/me/check/${item2.data.id}`, alice.token, { isChecked: true })).data?.isChecked === true);
check('bob cannot add to alice list', (await call('POST', `/kdo/me/create/${aliceList.id}`, bob.token)).status === 404);

// Not friends yet
check('bob cannot see alice list before being friends', (await call('GET', `/list/friend/${alice.id}`, bob.token)).status === 403);

// Invitation
const invitation = await call('POST', `/invitation/create/${aliceList.id}`, alice.token);
check('create invitation', invitation.status === 201 && invitation.data.inviter.id === alice.id, invitation);
const again = await call('POST', `/invitation/create/${aliceList.id}`, alice.token);
check('invitation link reused', again.data?.id === invitation.data.id, again);
check('bob cannot create an invitation to alice list', (await call('POST', `/invitation/create/${aliceList.id}`, bob.token)).status === 404);
const seen = await call('GET', `/invitation/${invitation.data.id}`, bob.token);
check('bob reads invitation', seen.status === 200 && seen.data.list.label === 'Tous' && seen.data.inviter.isFriend === false, seen);
check('alice cannot accept her own invitation', (await call('POST', `/invitation/accept/${invitation.data.id}`, alice.token)).status === 400);
const accepted = await call('POST', `/invitation/accept/${invitation.data.id}`, bob.token);
check('bob accepts invitation', accepted.status === 200 && accepted.data.friendId === alice.id, accepted);
check('accepting twice is harmless', (await call('POST', `/invitation/accept/${invitation.data.id}`, bob.token)).status === 200);
check('unknown invitation -> 404', (await call('GET', `/invitation/00000000-0000-4000-8000-000000000000`, bob.token)).status === 404);

// Friends both ways
const aliceFriends = await call('GET', '/friend/friends', alice.token);
check('alice friends = [bob]', aliceFriends.data?.length === 1 && aliceFriends.data[0].id === bob.id, aliceFriends);
const aliceLists = await call('GET', '/list/lists', alice.token);
check('bob is a member of alice list', aliceLists.data[0].friends.some((f) => f.id === bob.id && f.isFriend), aliceLists);
const bobLists = await call('GET', '/list/lists', bob.token);
check('bob lists = only his own', bobLists.data.length === 1 && bobLists.data[0].friends.some((f) => f.id === alice.id), bobLists);

const username = await call('GET', `/user/getUsername/${alice.id}`, bob.token);
check('getUsername returns JSON { name }', username.status === 200 && username.data?.name === alice.name, username);

// Bob views alice's list and reserves an item
const aliceSeenByBob = await call('GET', `/list/friend/${alice.id}`, bob.token);
check('bob sees alice items', aliceSeenByBob.status === 200 && aliceSeenByBob.data.uncheckedKdos.length === 1 && aliceSeenByBob.data.checkedKdos.length === 1, aliceSeenByBob);
check('alice items are not editable for bob', aliceSeenByBob.data.uncheckedKdos.every((k) => !k.authorId));
const taken = await call('PATCH', `/kdo/friend/check/${item.data.id}`, bob.token, { isChecked: true });
check('bob reserves alice item', taken.status === 200 && taken.data.takenBy.some((u) => u.id === bob.id), taken);
check('alice cannot reserve her own item', (await call('PATCH', `/kdo/friend/check/${item.data.id}`, alice.token, { isChecked: true })).status === 403);
check('carol (not a friend) cannot reserve', (await call('PATCH', `/kdo/friend/check/${item.data.id}`, carol.token, { isChecked: true })).status === 404);

// Surprise idea from bob for alice
const surprise = await call('POST', '/kdo/friend/create', bob.token, { friendId: alice.id });
check('bob adds a surprise idea for alice', surprise.status === 201 && surprise.data.authorId === bob.id, surprise);
await call('PATCH', `/kdo/updateLabel/${surprise.data.id}`, bob.token, { label: 'Surprise' });
const aliceOwn = await call('GET', `/list/me/${aliceList.id}`, alice.token);
const aliceIds = [...aliceOwn.data.uncheckedKdos, ...aliceOwn.data.checkedKdos].map((k) => k.id);
check('alice does not see the surprise idea', !aliceIds.includes(surprise.data.id), aliceOwn);
check('alice does not see who reserved', [...aliceOwn.data.uncheckedKdos, ...aliceOwn.data.checkedKdos].every((k) => !k.takenBy), aliceOwn);
const bobOwnList = (await call('GET', '/list/lists', bob.token)).data[0];
const bobOwn = await call('GET', `/list/me/${bobOwnList.id}`, bob.token);
check('surprise idea not on bob own list', bobOwn.data.uncheckedKdos.length === 0, bobOwn);
const withSurprise = await call('GET', `/list/friend/${alice.id}`, bob.token);
check('surprise idea on alice page for bob (editable)', withSurprise.data.uncheckedKdos.some((k) => k.id === surprise.data.id && k.authorId === bob.id), withSurprise);
check('alice cannot reserve the surprise for herself', (await call('PATCH', `/kdo/friend/check/${surprise.data.id}`, alice.token, { isChecked: true })).status === 404);
check('carol cannot create a surprise for alice', (await call('POST', '/kdo/friend/create', carol.token, { friendId: alice.id })).status === 403);

// Links on a Kdo (only its author manages them)
const link = await call('POST', `/kdo/link/${item.data.id}`, alice.token, { href: 'https://www.example.com/velo' });
check('alice adds a link to her item', link.status === 201 && link.data.href === 'https://www.example.com/velo', link);
check('non-http link refused', (await call('POST', `/kdo/link/${item.data.id}`, alice.token, { href: 'javascript:alert(1)' })).status === 400);
check('bob cannot add a link to alice item', (await call('POST', `/kdo/link/${item.data.id}`, bob.token, { href: 'https://example.com' })).status === 403);
const aliceWithLinks = await call('GET', `/list/me/${aliceList.id}`, alice.token);
check('alice sees the link on her list', aliceWithLinks.data.uncheckedKdos.find((k) => k.id === item.data.id)?.links?.length === 1, aliceWithLinks);
const bobSeesLinks = await call('GET', `/list/friend/${alice.id}`, bob.token);
check('bob sees the link on alice page', bobSeesLinks.data.uncheckedKdos.find((k) => k.id === item.data.id)?.links?.[0]?.href === 'https://www.example.com/velo', bobSeesLinks);
check('item without link has an empty list', bobSeesLinks.data.checkedKdos.find((k) => k.id === item2.data.id)?.links?.length === 0, bobSeesLinks);
check('bob cannot delete alice link', (await call('DELETE', `/kdo/link/${link.data.id}`, bob.token)).status === 403);
const link2 = await call('POST', `/kdo/link/${item.data.id}`, alice.token, { href: 'https://example.org/autre' });
check('alice deletes a link', (await call('DELETE', `/kdo/link/${link2.data.id}`, alice.token)).status === 200);
check('deleted link is gone', (await call('GET', `/list/me/${aliceList.id}`, alice.token)).data.uncheckedKdos.find((k) => k.id === item.data.id)?.links?.length === 1);

// Friend requests by name
check('request to unknown user -> 404', (await call('POST', '/friend/request', carol.token, { name: `nobody_${suffix}` })).status === 404);
check('request to myself -> 400', (await call('POST', '/friend/request', carol.token, { name: carol.name })).status === 400);
const request = await call('POST', '/friend/request', carol.token, { name: alice.name });
check('carol sends a request to alice', request.status === 201 && request.data.status === 'PENDING', request);
check('duplicate request -> 409', (await call('POST', '/friend/request', carol.token, { name: alice.name })).status === 409);
const aliceRequests = await call('GET', '/friend/requests', alice.token);
check('alice received it', aliceRequests.data?.received.length === 1 && aliceRequests.data.received[0].user.id === carol.id, aliceRequests);
check('carol cannot accept her own request', (await call('POST', `/friend/accept/${request.data.id}`, carol.token)).status === 404);
const acceptedRequest = await call('POST', `/friend/accept/${request.data.id}`, alice.token);
check('alice accepts', acceptedRequest.status === 200 && acceptedRequest.data.status === 'ACCEPTED', acceptedRequest);
check('carol sees alice list now', (await call('GET', `/list/friend/${alice.id}`, carol.token)).status === 200);
const takenSeenByCarol = (await call('GET', `/list/friend/${alice.id}`, carol.token)).data.uncheckedKdos.find((k) => k.id === item.data.id);
check('carol sees bob reserved it (bob not her friend)', takenSeenByCarol?.takenBy.some((u) => u.id === bob.id && u.isFriend === false), takenSeenByCarol);

// Request from bob to carol, then the reverse request auto-accepts
await call('POST', '/friend/request', bob.token, { name: carol.name });
const reverse = await call('POST', '/friend/request', carol.token, { name: bob.name });
check('reverse request accepts the pending one', reverse.data?.status === 'ACCEPTED', reverse);

// Declining / cancelling
const dave = await register(`dave_${suffix}`);
const toCancel = await call('POST', '/friend/request', dave.token, { name: alice.name });
check('dave cancels his request', (await call('DELETE', `/friend/request/${toCancel.data.id}`, dave.token)).status === 200);
const toDecline = await call('POST', '/friend/request', dave.token, { name: alice.name });
check('alice declines dave', (await call('DELETE', `/friend/request/${toDecline.data.id}`, alice.token)).status === 200);
check('dave is not alice friend', (await call('GET', `/list/friend/${alice.id}`, dave.token)).status === 403);

// Removing a friend
check('bob removes alice', (await call('DELETE', `/friend/${alice.id}`, bob.token)).status === 200);
check('bob no longer sees alice list', (await call('GET', `/list/friend/${alice.id}`, bob.token)).status === 403);
const afterRemove = await call('GET', `/list/friend/${alice.id}`, carol.token);
const itemAfter = afterRemove.data.uncheckedKdos.find((k) => k.id === item.data.id);
check('bob reservation removed', itemAfter && !itemAfter.takenBy.some((u) => u.id === bob.id), itemAfter);
check('bob surprise idea removed', !afterRemove.data.uncheckedKdos.some((k) => k.id === surprise.data.id), afterRemove);
check('bob left alice list', !(await call('GET', '/list/lists', alice.token)).data[0].friends.some((f) => f.id === bob.id));

// Description and deletion
check('update description', (await call('PUT', `/list/updateDescription/${aliceList.id}`, alice.token, { description: 'Taille M' })).data?.description === 'Taille M');
check('delete my item', (await call('DELETE', `/kdo/${item2.data.id}`, alice.token)).status === 200);

// Password reset (e-mails caught by Mailpit, see compose.yml)
const MAILPIT = process.env.MAILPIT_URL ?? 'http://localhost:8025';
check('reset without e-mail on the account -> 400', (await call('POST', '/auth/forgotPassword', null, { identifier: bob.name })).status === 400);
check('reset for unknown user -> 404', (await call('POST', '/auth/forgotPassword', null, { identifier: `nobody_${suffix}` })).status === 404);
const forgot = await call('POST', '/auth/forgotPassword', null, { identifier: `alice_${suffix}@example.com` });
check('reset e-mail sent (by e-mail address)', forgot.status === 200 && forgot.data.email.endsWith('@example.com') && forgot.data.email.includes('*'), forgot);
check('second request within a minute -> 429', (await call('POST', '/auth/forgotPassword', null, { identifier: alice.name })).status === 429);
let resetToken = null;
for (let attempt = 0; attempt < 10 && !resetToken; attempt++) {
    try {
        const search = await (await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:alice_${suffix}@example.com`)}`)).json();
        const id = search.messages?.[0]?.ID;
        if (id) {
            const message = await (await fetch(`${MAILPIT}/api/v1/message/${id}`)).json();
            resetToken = message.Text.match(/reset-password\/([A-Za-z0-9_-]+)/)?.[1] ?? null;
        }
    } catch {
        // Mailpit not ready yet
    }
    if (!resetToken) await new Promise((resolve) => setTimeout(resolve, 1000));
}
check('reset e-mail received in Mailpit with a link', resetToken !== null);
if (resetToken) {
    check('too short password -> 400', (await call('POST', '/auth/resetPassword', null, { token: resetToken, password: 'ab' })).status === 400);
    check('reset password', (await call('POST', '/auth/resetPassword', null, { token: resetToken, password: 'newSecret456' })).status === 200);
    check('link works only once', (await call('POST', '/auth/resetPassword', null, { token: resetToken, password: 'other789' })).status === 400);
    check('old password rejected', (await call('POST', '/auth/login', null, { name: alice.name, password: 'secret123' })).status === 401);
    check('login with new password', (await call('POST', '/auth/login', null, { name: alice.name, password: 'newSecret456' })).status === 200);
}
check('invalid reset link -> 400', (await call('POST', '/auth/resetPassword', null, { token: 'not-a-real-token', password: 'whatever1' })).status === 400);

console.log(failures === 0 ? 'ALL SMOKE TESTS PASSED' : `${failures} SMOKE TEST(S) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
