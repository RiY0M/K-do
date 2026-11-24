import { useEffect, useState } from "react";
import MyListRedirect from "../components/navigation/redirects/MyListRedirect";
import { AccountInfo } from "../interfaces/AccountInfo";
import { getMyAccount } from "../services/api/users";
import { mdSectionIdealWidth, smSectionIdealWidth } from "../services/utils";
import Page from "./Page";
import AccountDisplaySection from "../components/sections/specific/AccountDisplaySection";
import Logout from "../components/navigation/redirects/Logout";
import NotificationsSection from "../components/sections/specific/NotificationsSection";
import InlineSections from "../components/statics/InlineSections";
import NavLink from "../components/navigation/redirects/NavLink";
import HomeRedirect from "../components/navigation/redirects/HomeRedirect";

export default function Account() {

  const reverseButtons = false; // TODO : user parameter
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    getMyAccount()
      .then((loaded) => {
        setAccount(loaded);
      })
      .catch(console.error);
  }, []);

  return (
    <Page
      title="Compte"
      idealWidthLandscape={mdSectionIdealWidth + smSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
      nbInlineSections={2}
    >
      <NavLink reverseDirection={reverseButtons}>
        <HomeRedirect reverseDirection={!reverseButtons} />
        <MyListRedirect reverseDirection={reverseButtons} />
      </NavLink>

      {account &&
        <InlineSections>
          <AccountDisplaySection
            account={account}
            setAccount={setAccount}
          />

          <NotificationsSection
            account={account}
            setAccount={setAccount}
          />
        </InlineSections>
      }

      <NavLink soloButton reverseDirection={reverseButtons}>
        <Logout reverseDirection={reverseButtons} />
      </NavLink>
    </Page>
  );
}
