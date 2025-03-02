import { useCallback, useState } from "preact/hooks";
import SideLink from "./SideLink"



const SideGroup = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  const openGroup = useCallback((e) => {
    e.preventDefault();
    setOpen(!open);
  }, [setOpen, open]);

  return (
    <>
      <SideLink title={title} href={"/test"} type={1} opened={open} onOpen={openGroup} />
      <div class={`sidewrapper${open ? ' open' : ''}`}>
        <div class="sideinner">
          { children }
        </div>
      </div>
    </>
  )
}

export default SideGroup