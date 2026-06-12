# Clerk Auth - Quick Reference Guide

## Key Files at a Glance

### 🔐 Authentication Entry Points
- **Sign In**: `app/(auth)/signin.tsx`
- **Sign Up**: `app/(auth)/signup.tsx`
- **Settings/Sign Out**: `app/(tabs)/Settings.tsx`

### 🏗️ Architecture
- **Provider**: `app/_layout.tsx` (ClerkProvider wrapper)
- **Routing**: `app/(auth)/_layout.tsx` (auth group)
- **Components**: `app/components/` (Button, InputField)
- **Utilities**: `app/lib/validation.ts` & `app/lib/authHooks.ts`

## Common Tasks

### Check If User Is Logged In
```typescript
import { useAuth } from '@clerk/clerk-expo';

const { isSignedIn, isLoaded } = useAuth();
if (isLoaded && isSignedIn) {
  // User is logged in
}
```

### Get Current User Info
```typescript
import { useUser } from '@clerk/clerk-expo';

const { user } = useUser();
console.log(user?.emailAddresses[0].emailAddress);
console.log(user?.firstName, user?.lastName);
```

### Sign Out User
```typescript
import { useAuth } from '@clerk/clerk-expo';

const { signOut } = useAuth();
await signOut();
router.replace('/(auth)/signin');
```

### Validate Form Input
```typescript
import { validateSignIn, validateSignUp } from '@/app/lib/validation';

const errors = validateSignIn(email, password);
if (Object.keys(errors).length > 0) {
  // Show errors
}
```

### Create Custom Button
```typescript
import { Button } from '@/app/components/Button';

<Button
  title="Submit"
  onPress={handleSubmit}
  loading={isLoading}
  disabled={isLoading}
  variant="primary"
  size="lg"
/>
```

### Create Custom Input
```typescript
import { InputField } from '@/app/components/InputField';

<InputField
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  error={errors.email}
/>
```

## Design System Quick Reference

### Colors
```typescript
background: "#fff9e3"   // Warm cream
foreground: "#081126"   // Dark navy
primary: "#081126"      // Dark navy (buttons, text)
accent: "#ea7a53"       // Coral (links, highlights)
card: "#fff8e7"         // Off-white (inputs, cards)
destructive: "#dc2626"  // Red (errors, danger)
success: "#16a34a"      // Green (success)
```

### Spacing
```
1: 4px    2: 8px    3: 12px   4: 16px   5: 20px
6: 24px   7: 28px   8: 32px   9: 36px  10: 40px
11: 44px 12: 48px  14: 56px  16: 64px  18: 72px
20: 80px 24: 96px  30: 120px
```

### Typography
```
Header: text-3xl font-bold text-primary (32px, bold)
Title: text-2xl font-bold text-primary (24px, bold)
Label: text-sm font-semibold text-foreground (14px, semibold)
Body: text-base text-foreground (16px, regular)
Small: text-xs text-muted-foreground (12px, regular)
```

## Environment Variables

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

The key is already set in `.env` for development.

## Testing Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Start dev server
npm start

# Test on iOS
npm run ios

# Test on Android
npm run android

# Test on web
npm run web
```

## Common Errors & Fixes

### "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined"
- Check `.env` file has the key
- Restart dev server after changing `.env`

### "useAuth() called outside ClerkProvider"
- Ensure component is inside ClerkProvider (it is - at root level)
- Make sure component is not rendering during provider setup

### "Token not persisting"
- Verify `expo-secure-store` is installed
- Check Android has encryption enabled
- Clear app cache and restart

### Navigation loops
- Ensure auth state is properly checked before routing
- Don't call router.push inside useEffect without dependencies
- Use `useRouter().replace()` instead of `.push()`

## File Structure

```
expo-app/
├── app/
│   ├── _layout.tsx                 ← ClerkProvider, root navigation
│   ├── (auth)/
│   │   ├── _layout.tsx             ← Auth group layout
│   │   ├── signin.tsx              ← Sign in screen
│   │   └── signup.tsx              ← Sign up screen
│   ├── (tabs)/
│   │   ├── _layout.tsx             ← Tab navigation
│   │   ├── index.tsx               ← Home screen
│   │   ├── Settings.tsx            ← Settings with sign out
│   │   ├── Subscriptions.tsx
│   │   └── [id].tsx
│   ├── components/
│   │   ├── Button.tsx              ← Reusable button
│   │   └── InputField.tsx          ← Reusable input
│   ├── constants/
│   │   ├── theme.ts                ← Color tokens
│   │   ├── data.ts
│   │   └── icons.ts
│   └── lib/
│       ├── validation.ts           ← Form validators
│       ├── authHooks.ts            ← Auth utilities
│       └── utils.ts
├── assets/                         ← Images, icons, fonts
├── .env                            ← Clerk key
├── AUTH_IMPLEMENTATION.md          ← Full documentation
├── AUTH_QUICK_REFERENCE.md         ← This file
└── package.json
```

## Next Steps

1. **Run the app**: `npm start`
2. **Test sign up**: Create account with email
3. **Check email**: Look for verification code
4. **Test sign in**: Sign in with created account
5. **Test sign out**: Use Settings screen
6. **Customize**: Update text/colors as needed
7. **Deploy**: Update to production Clerk keys

## Support Resources

- 📚 Full docs: See `AUTH_IMPLEMENTATION.md`
- 🔗 Clerk Docs: https://clerk.com/docs
- 🔗 Expo Docs: https://docs.expo.dev
- 🔗 NativeWind: https://www.nativewind.dev
