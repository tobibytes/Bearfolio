import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Card } from '../components/Card';

const NotFound = () => {
  return (
    <PageShell>
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md space-y-4 p-6 text-center">
          <p className="text-3xl font-bold">404</p>
          <p className="text-muted">We could not find that page.</p>
          <Link to="/" className="button-focus inline-flex justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-brand">
            Back home
          </Link>
        </Card>
      </div>
    </PageShell>
  );
};

export default NotFound;
