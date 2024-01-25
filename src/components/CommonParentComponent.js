
import { useState } from "react";
import Header from "./Header";
import Org_Admin from "./Org_Admin";

const CommonParentComponent = () => {
  const OrgAdminPer = localStorage.getItem("OrgAdminPer");
  const parsedOrgAdminPer = JSON.parse(OrgAdminPer);
  const [currentOrg, setCurrentOrg] = useState(parsedOrgAdminPer[0]);

  const switchOrganization1 = (org) => {
    setCurrentOrg(org);
  };

  return (
    <div>
      <Header switchOrganization={switchOrganization1} />
      <Org_Admin currentOrg={currentOrg} />
    </div>
  );
};

export default CommonParentComponent;
