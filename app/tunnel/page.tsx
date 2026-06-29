import { getTunnelConfig } from '@/lib/tunnel/loader'
import TunnelClient from '@/components/tunnel/TunnelClient'

export const dynamic = 'force-dynamic'

export default async function TunnelPage() {
  const { config } = await getTunnelConfig()
  return <TunnelClient config={config} />
}
