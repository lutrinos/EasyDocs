import Content from "./Content"
import Sidebar from "./Sidebar"
import TableOfContents from "./TableOfContents"


const Body = () => {
  return (
    <div class="app">
      <div class="body">
        <Sidebar />
        <Content />
        <TableOfContents />
      </div>
    </div>
  )
}

export default Body