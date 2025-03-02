import SideGroup from "../components/Sidebar/SideGroup";
import SideLink from "../components/Sidebar/SideLink";

const Sidebar = () => {
  return (
    <div class="sidebar">
      <SideGroup title={"Group 1"}>
        <SideLink title={"Test A"} href={"/test"} />
        <SideLink title={"Test B"} href={"/test"} />
        <SideLink title={"Test C"} href={"/test"} />
      </SideGroup>
      <SideGroup title={"Group 2"}>
        <SideLink title={"Test A"} href={"/test"} />
        <SideLink title={"Test B"} href={"/test"} />
        <SideLink title={"Test C"} href={"/test"} />
      </SideGroup>
      <SideGroup title={"Group 3"}>
        <SideLink title={"Test A"} href={"/test"} />
        <SideLink title={"Test B"} href={"/test"} />
        <SideLink title={"Test C"} href={"/test"} />
        <SideGroup title={"Subgroup"}>
          <SideLink title={"Test A"} href={"/test"} />
          <SideLink title={"Test B"} href={"/test"} />
          <SideLink title={"Test C"} href={"/test"} />
        </SideGroup>
      </SideGroup>
    </div>
  );
};

export default Sidebar;
