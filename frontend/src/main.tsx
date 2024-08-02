import { createRoot } from 'react-dom/client'
import { Fragment } from 'react/jsx-runtime'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <Fragment>
    <>
      <p>Change me and I'll refresh, like magic!</p>
    </>
  </Fragment>,
)
