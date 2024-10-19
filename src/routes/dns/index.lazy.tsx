import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dns/')({
  component: () => <div>Hello /dns/!</div>,
})
