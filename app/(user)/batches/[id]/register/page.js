import BatchRegisterClient from './BatchRegisterClient';

export default async function BatchRegisterPage({ params }) {
  const { id: batchId } = await params;
  return <BatchRegisterClient batchId={batchId} />;
}
