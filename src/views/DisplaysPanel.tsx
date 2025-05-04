import { useDeviceStore } from "@/store/device-store"
import { Edit } from "lucide-react"
import { RemoteDisplay } from "@/store/device-store"

export default function DisplaysPanel() {
  const store = useDeviceStore()

  function renameRemote(remote: RemoteDisplay) {
    const newName = window.prompt('input new name', remote.name)
    if (!newName) return
    store.renameRemote(remote.id, newName)
  }

  return (
    <div className="div">
      {!store.sharing && !store.connecting && (
        <button onClick={store.connect} className="btn btn-primary">
          Start Sharing
        </button>
      )}
      {store.sharing && !store.connecting && (
        <button onClick={store.stopSharing} className="btn btn-error">
          Stop sharing
        </button>
      )}
      <ul>
        <li>is sharing: {store.sharing ? 'yes' : 'no'}</li>
        <li>is connected: {store.connection ? 'yes' : 'no'}</li>
      </ul>

      <table className="table table-sm my-8 text-center">
        <thead>
          <tr>
            <th>name</th>
            <th>connected</th>
            <th>rename</th>
          </tr>
        </thead>
        <tbody>
          {store.remotes.map((remote) => (
            <tr key={remote.id}>
              <td>{remote.name}</td>
              <td>{remote.connected ? 'yes' : 'no'}</td>
              <td>
                <button
                  className="btn btn-sm btn-circle"
                  onClick={() => renameRemote(remote)}
                >
                  <Edit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
