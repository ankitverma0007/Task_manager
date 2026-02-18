import { useState } from "react";

export default function Profile({
  user,
  loading,
  handleLogout,
  handleDeleteAccount,
  handleDeleteAllNotes,
  handleChangePassword,
}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);


  // CHANGE PASSWORD

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      await handleChangePassword(passwordData);

      setPasswordSuccess("Password updated successfully!");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1200);
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message || "Failed to update password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };


  // DELETE ACCOUNT
  const confirmDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Password is required.");
      return;
    }

    try {
      setDeleteLoading(true);
      await handleDeleteAccount(deletePassword);
      setShowDeleteModal(false);
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || "Failed to delete account."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "850px" }}>
      
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="fw-bold">Settings</h2>
        <p className="text-muted">
          Manage your account preferences and application data.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4 d-flex align-items-center">
          <div
            className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center me-4"
            style={{ width: "70px", height: "70px", fontSize: "1.5rem" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h5 className="mb-1 fw-semibold">{user?.name}</h5>
            <p className="text-muted mb-0 small">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* DATA MANAGEMENT */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h6 className="text-uppercase text-muted small mb-4">
            Data Management
          </h6>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-1">Delete All Notes</h6>
              <small className="text-muted">
                Permanently remove all your notes.
              </small>
            </div>

            <button
              className="btn btn-outline-warning btn-sm"
              onClick={handleDeleteAllNotes}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ACCOUNT */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h6 className="text-uppercase text-muted small mb-4">
            Account
          </h6>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-1">Change Password</h6>
              <small className="text-muted">
                Update your account password securely.
              </small>
            </div>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change
            </button>
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Logout</h6>
              <small className="text-muted">
                Sign out from your account.
              </small>
            </div>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="card border-danger border-2 rounded-4 mb-5">
        <div className="card-body p-4">
          <h6 className="text-danger text-uppercase small mb-4">
            Danger Zone
          </h6>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1 text-danger">Delete Account</h6>
              <small className="text-muted">
                Permanently delete your account and all associated data.
              </small>
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                setDeletePassword("");
                setDeleteError("");
                setShowDeleteModal(true);
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">

              <div className="modal-header border-0">
                <h5 className="fw-bold">Change Password</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                />
              </div>

              <div className="modal-body">

                {passwordError && (
                  <div className="alert alert-danger py-2">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="alert alert-success py-2">
                    {passwordSuccess}
                  </div>
                )}

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handlePasswordSubmit}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">

              <div className="modal-header border-0">
                <h5 className="fw-bold text-danger">Delete Account</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="alert alert-warning small">
                  This action is permanent and cannot be undone.
                </div>

                {deleteError && (
                  <div className="alert alert-danger py-2">
                    {deleteError}
                  </div>
                )}

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
