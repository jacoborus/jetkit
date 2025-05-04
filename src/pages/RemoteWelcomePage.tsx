import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'

export default function SharedWelcomePage() {
  const [shortcode, setShortcode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/display/${shortcode}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Enter Shortcode</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Shortcode (4 characters)</span>
              </label>
              <input
                type="text"
                placeholder="Enter code"
                className="input input-bordered w-full"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value.toUpperCase())}
                maxLength={8}
              />
            </div>
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={shortcode.length < 5}
              >
                Go
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
