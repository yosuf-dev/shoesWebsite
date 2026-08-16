import Badge from './Badge';
import { ORDER_STATUS } from '../../constants/config';

export default function StatusBadge({ status }) {
  const st = ORDER_STATUS[status];
  if (!st) return <Badge variant="muted">{status}</Badge>;
  return <Badge variant={st.color} dot>{st.label}</Badge>;
}
