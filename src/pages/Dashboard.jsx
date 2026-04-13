import Layout from "../components/Layout";

function Dashboard() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Approved</h3>
          <p className="text-2xl font-bold text-green-500">80</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Pending</h3>
          <p className="text-2xl font-bold text-yellow-500">40</p>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;