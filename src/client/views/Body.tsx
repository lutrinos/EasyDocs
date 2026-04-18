import Content from "./Content"
import Sidebar from "./Sidebar"
import TableOfContents from "./TableOfContents"


const Body = () => {
  return (
    <div class="flex flex-row">
      <Sidebar />

      <div class="drawer-content flex flex-row">
        <Content />
        <TableOfContents />
      </div>
    </div>
  )
}

export default Body