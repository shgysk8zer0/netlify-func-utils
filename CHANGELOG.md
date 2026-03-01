<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.1.2] - 2026-03-01

### Changed
- Recreate `package-lock.json` and `node_modules/`

## [v1.1.1] - 2026-03-01

### Changed
- Update dependencies and config
- Update npm publishing
- Update to node 24.10.0

## [v1.1.0] - 2024-05-12

### Added
- Add `RequestCookies` class with static method to parse from headers
- Add `api/test` for testing

### Fixed
- Fix encoding issue of binary data in requests
- Fix invalid `Options` instead of `Allow` HTTP headers in response
- Improve handling of CORS requests

## [v1.0.3] - 2023-10-10

### Changed
- `NetlifyRequest` now keeps the `Referer` header

### Fixed
- `NetlifyRequest` now better detects form data and JSON
- No longer have `netlify-cli` as a peer-dependency (it's a dev-dependency)

## [v1.0.2] - 2023-10-01

### Added
- Add missing functions to `validation.js`

## [v1.0.1] - 2023-10-01

### Added
- Add CommonJS versions of all modules

### Fixed
- Update to use constants from correct packages

## [v1.0.0] - 2023-09-29

Initial Release
