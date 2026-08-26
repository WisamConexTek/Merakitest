/* One icon map, shared by the services grid and the header dropdown, so an
   icon can never drift between the two places a service is browsed. */
import { Layers, Server, Network, ShieldCheck, Radar, HardDrive, Workflow, LifeBuoy } from 'lucide-react'

export const SERVICE_ICON_MAP: Record<string, typeof Layers> = {
  Layers,
  Server,
  Network,
  ShieldCheck,
  Radar,
  HardDrive,
  Workflow,
  LifeBuoy,
}
