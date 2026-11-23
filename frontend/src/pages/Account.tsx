import { useEffect, useState } from "react";
import MyListRedirect from "../components/navigation/MyListRedirect";
import { AccountInfo } from "../interfaces/AccountInfo";
import { getMyAccount } from "../services/api/users";
import { CSS, mdSectionIdealWidth, smSectionIdealWidth } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";
import Page from "./Page";
import AccountDisplaySection from "../components/sections/specific/AccountDisplaySection";
import Logout from "../components/navigation/Logout";
import NotificationsSection from "../components/sections/specific/NotificationsSection";

export default function Account() {

  const [account, setAccount] = useState<AccountInfo | null>(null);

  const behaviourDisplay = useBehaviourDisplay();

  useEffect(() => {
    getMyAccount()
      .then((loaded) => {
        setAccount(loaded);
      })
      .catch(console.error);
  }, []);

  const styles: CSS = {
    subDiv: {
      flexDirection: behaviourDisplay === "landscape" ? "row" : "column",
    },
  };

  return (
    <Page
      title="Compte"
      idealSectionsWidth={mdSectionIdealWidth + smSectionIdealWidth}
      nbInlineSections={2}
    >
      <MyListRedirect />

      {account &&
        <div style={styles.subDiv}>
          <AccountDisplaySection
            account={account}
            setAccount={setAccount}
          />

          <NotificationsSection
            account={account}
            setAccount={setAccount}
          />
        </div>
      }

      <Logout />
    </Page>
  );
}
