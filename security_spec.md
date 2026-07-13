# Security Specification: The Empire Firestore Security

This security specification details the threat model, data invariants, and security constraints for the Firestore database of **The Empire**.

---

## 1. Data Invariants

- **Users (`/users/{userId}`)**: 
  - A user profile must be strictly bound to the authenticated user's ID (`request.auth.uid`). No user can read or modify another user's profile.
- **Menu (`/menu/{itemId}`)**: 
  - Read access is fully public (open to all customers).
  - Write access is restricted to authenticated managers/admins.
- **Orders (`/orders/{orderId}`)**:
  - A customer can only create, view, or modify their own orders (where `userId == request.auth.uid`).
  - Admins can view and update all orders (e.g., update the delivery status).
- **Reservations (`/reservations/{resId}`)**:
  - A customer can only create, view, or modify their own bookings (where `userId == request.auth.uid`).
  - Admins can view and update all reservations.
- **Feedbacks (`/feedbacks/{feedbackId}`)**:
  - Read access is public (anyone can view customer reviews).
  - Write access is restricted to the authenticated customer who authored it (`userId == request.auth.uid`).

---

## 2. The "Dirty Dozen" Threat Payloads

The following malicious payloads must be rejected by the security rules:

1. **User Spoofing**: An authenticated user trying to read `/users/different_uid`.
2. **User Profile Tampering**: An authenticated user trying to write to `/users/different_uid` or modifying the system fields.
3. **Menu Poisoning**: A general user attempting to inject a malicious menu item or modify pricing under `/menu/item123`.
4. **Order Hijacking**: A user querying or accessing `/orders/order_xyz` belonging to another user.
5. **Unauthorized Order Creation**: Placing an order with `userId` set to a victim's ID.
6. **Order State Escaping**: A user attempting to self-approve or mark their order as "Completed" or "Delivered" without pay.
7. **Reservation Stealing**: Accessing or canceling table reservation `/reservations/res_xyz` belonging to another customer.
8. **Feedback Hijacking**: Creating or modifying `/feedbacks/feed_123` with another user's identity.
9. **Junk ID Resource Exhaustion**: Injecting an extremely long string (>128 chars) or invalid character string as a document ID.
10. **Shadow Key Injection**: Adding unapproved hidden fields during creation/update to bypass schema constraints.
11. **Temporal Spoofing**: Providing a back-dated or future-dated timestamp from the client instead of using `request.time`.
12. **Blanket Read Harvesting**: Fetching all orders using a broad query without filtering by `userId` or administrative privilege.

---

## 3. Test Runner Configurations

To verify that all malicious payloads return `PERMISSION_DENIED`, we define the firestore rule assertions below:

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

// 1. User Spoofing test
await assertFails(aliceDb.doc("users/bob").get());

// 2. Menu Manipulation by Non-Admin
await assertFails(aliceDb.doc("menu/burger").set({ name: "Free Burger", price: 0 }));

// 3. Order Hijacking
await assertFails(bobDb.doc("orders/alice_order_1").get());

// 4. Default Deny-All for Unspecified collections
await assertFails(aliceDb.doc("internal_logs/log_1").get());
```
