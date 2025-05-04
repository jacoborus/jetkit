import { useEffect } from 'react'
import { useParams } from 'react-router'

import RemoteDisplayView from '@/views/RemoteDisplayView'
import { useRemoteStore } from '@/store/remote-store'

export default function RemoteDisplayPage() {
  const remote = useRemoteStore();
  const { code } = useParams<{ code: string }>()
  useEffect(() => {
    if (remote.running) return
    if (!code) return
    remote.connect(code)
  }, [code]) // eslint-disable-line

  return (
    <>
      <RemoteDisplayView />
      {/**
      {remote.running && <RemoteDisplayView />}
      */}
    </>
  )
}
