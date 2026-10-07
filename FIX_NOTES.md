# ScentCafe Fix Notes

This file records the issue that was identified and the backend fix that was applied.

## Problem
The repository was inconsistent:
- the frontend login/signup flow in `index.html` was using localStorage as a demo-only flow
- the backend in `server.js` implemented a real Express API, but the app UI did not actually use it
- admin API documentation claimed role-based admin support, but the app behavior did not match the docs

## Fix applied
The backend was updated to support:
- customer signup/login
- request creation and retrieval
- admin login via `admin@scentcafe.com` / `admin123`
- admin-only endpoints for listing, updating, and deleting requests
- proper role-aware authentication
- valid ticket status enforcement

## Current status
The repo now has a working backend foundation for the requested functionality.
