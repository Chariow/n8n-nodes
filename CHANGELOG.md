# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-30

### Added

- Initial release of n8n-nodes-chariow
- **Chariow Node** with support for:
  - Customer operations (Get, Get Many)
  - Product operations (Get, Get Many)
  - Sale operations (Get, Get Many)
  - Discount operations (Get, Get Many)
  - Licence operations (Get, Get Many, Activate, Revoke, Get Activations)
  - Checkout operations (Create)
  - Store operations (Get Info)
- **Chariow Trigger Node** with webhook support for:
  - Sale events (successful, abandoned, failed, refunded)
  - Licence events (activated, expired, issued, revoked)
- API Key authentication via Bearer token
- Product filtering for webhook events
