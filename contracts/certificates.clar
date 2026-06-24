;; Certichain

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_APPROVED (err u103))
(define-constant ERR_ALREADY_APPROVED (err u104))
(define-constant ERR_CERT_NOT_FOUND (err u105))

(define-constant ADMIN 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; --- MAPS ---

(define-map issuers principal bool)

(define-map certificates
  uint
  {
    issuer: principal,
    recipient: principal,
    title: (string-ascii 100),
    issued-at: uint,
    revoked: bool
  }
)

(define-data-var cert-counter uint u0)

;; --- PRIVATE HELPERS ---

(define-private (is-admin)
  (is-eq tx-sender ADMIN)
)

(define-private (is-approved-issuer (issuer principal))
  (default-to false (map-get? issuers issuer))
)

;; --- ISSUER MANAGEMENT ---

(define-public (approve-issuer (issuer principal))
  (begin
    (asserts! (is-admin) ERR_UNAUTHORIZED)
    (asserts! (not (is-approved-issuer issuer)) ERR_ALREADY_APPROVED)
    (map-set issuers issuer true)
    (ok true)
  )
)

(define-public (revoke-issuer (issuer principal))
  (begin
    (asserts! (is-admin) ERR_UNAUTHORIZED)
    (asserts! (is-approved-issuer issuer) ERR_NOT_APPROVED)
    (map-set issuers issuer false)
    (ok true)
  )
)

;; --- CERTIFICATE ISSUANCE ---

(define-public (issue-certificate (recipient principal) (title (string-ascii 100)))
  (let ((cert-id (+ (var-get cert-counter) u1)))
    (asserts! (is-approved-issuer tx-sender) ERR_NOT_APPROVED)
    (map-set certificates cert-id
      {
        issuer: tx-sender,
        recipient: recipient,
        title: title,
        issued-at: stacks-block-height,
        revoked: false
      }
    )
    (var-set cert-counter cert-id)
    (ok cert-id)
  )
)

(define-public (revoke-certificate (cert-id uint))
  (let ((cert (unwrap! (map-get? certificates cert-id) ERR_CERT_NOT_FOUND)))
    (asserts! (is-admin) ERR_UNAUTHORIZED)
    (map-set certificates cert-id (merge cert { revoked: true }))
    (ok true)
  )
)

;; --- VERIFICATION ---

(define-read-only (verify-certificate (cert-id uint))
  (match (map-get? certificates cert-id)
    cert (ok {
      issuer: (get issuer cert),
      recipient: (get recipient cert),
      title: (get title cert),
      issued-at: (get issued-at cert),
      revoked: (get revoked cert),
      issuer-still-approved: (is-approved-issuer (get issuer cert))
    })
    ERR_CERT_NOT_FOUND
  )
)

(define-read-only (check-issuer (issuer principal))
  (ok (is-approved-issuer issuer))
)

(define-read-only (get-cert-count)
  (ok (var-get cert-counter))
)
