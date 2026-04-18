import { useToc } from "../states/toc"


const TableOfContents = () => {
  const table = useToc((state) => state.state);

  return (
    <aside class="sticky top-0 flex flex-col w-2xs pt-2">
      {
        table.map((item) => (
          <a
            style={{
              paddingLeft: 8 + item.level * 14
            }}
            class="py-3 w-full border-l-2 border-base-300 hover:border-primary hover:text-primary" href={`#${item.id}`}>{item.label}</a>
        ))
      }
    </aside>
  )
}

export default TableOfContents