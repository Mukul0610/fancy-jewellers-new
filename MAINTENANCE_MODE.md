# Maintenance Mode Implementation

## Overview
The app now supports a **Maintenance Mode** feature that allows you to temporarily disable all pricing functionality across the application. When enabled, users will see "Under Maintenance" messages instead of live gold prices and calculator functionality.

## How It Works

### API Endpoint
The maintenance mode is controlled via the **stopper API**:
```
https://admin-pearl-kappa-34.vercel.app/api/stopper
```

### API Response Format
```json
[
  {
    "_id": "690395d53c64fb216a8b7762",
    "x": false,
    "createdAt": "2025-10-30T16:44:06.006Z",
    "updatedAt": "2025-10-30T16:44:15.353Z",
    "__v": 0
  }
]
```

### Maintenance Mode Control
- **`x: false`** → Normal operation (prices shown, calculator works)
- **`x: true`** → Maintenance mode (all pricing features disabled)

## What Gets Disabled

When maintenance mode is **active** (`x: true`):

### 1. Home Page (Dashboard)
- ✅ Hero banner still works
- ❌ Live gold price shows "Under Maintenance"
- ❌ Gold quality prices (22K, 18K, etc.) replaced with maintenance message
- ✅ Navigation remains functional

### 2. Calculator Page
- ❌ Entire calculator form hidden
- ❌ Price calculations disabled
- ✅ Shows centered maintenance message with icon
- ✅ Current rate header shows "Under Maintenance"

### 3. Other Pages
- ✅ Profile, Jewellery, Coins, About, Contact remain fully functional
- ✅ Login/Logout functionality unaffected
- ✅ Notifications still work

## Technical Implementation

### Context Provider (`app/(tabs)/_layout.tsx`)
```typescript
type GoldPriceContextType = {
  goldPrice: number;
  loading: boolean;
  isMaintenanceMode: boolean;  // ← New field
};

// Checks stopper API on app initialization
const checkMaintenanceMode = useCallback(async () => {
  const response = await axios.get('https://admin-pearl-kappa-34.vercel.app/api/stopper');
  const stopperData = response.data[0];
  setIsMaintenanceMode(stopperData.x);
}, []);
```

### Home Page (`app/(tabs)/index.tsx`)
```typescript
const { goldPrice, loading, isMaintenanceMode } = useContext(GoldPriceContext);

{isMaintenanceMode ? (
  <View style={styles.maintenanceContainer}>
    <MaterialCommunityIcons name="tools" size={48} color="#FFD700" />
    <Text style={styles.maintenanceText}>Under Maintenance</Text>
    <Text style={styles.maintenanceSubtext}>Pricing updates temporarily unavailable</Text>
  </View>
) : (
  // Normal price display
)}
```

### Calculator (`app/(tabs)/calculator.tsx`)
```typescript
const { goldPriceFromContext, isMaintenanceMode } = useContext(GoldPriceContext);

{isMaintenanceMode ? (
  <View style={styles.maintenanceWrapper}>
    <MaterialCommunityIcons name="tools" size={80} color={Colors.fontColors} />
    <Text style={styles.maintenanceTitle}>Under Maintenance</Text>
    <Text style={styles.maintenanceText}>
      The calculator is temporarily unavailable.
      Please check back later.
    </Text>
  </View>
) : (
  // Normal calculator form
)}
```

## Testing the Feature

### Enable Maintenance Mode
1. Update the stopper API to set `x: true`
2. Restart the app or wait for the next data refresh
3. Verify all pricing sections show "Under Maintenance"

### Disable Maintenance Mode
1. Update the stopper API to set `x: false`
2. Restart the app or wait for the next data refresh
3. Verify all pricing sections show live data again

## Refresh Behavior

The maintenance mode status is checked:
- ✅ On app launch
- ✅ When app comes back to foreground
- ✅ During the regular price update cycle (every 10 seconds)

This means changes to the stopper API will be reflected within 10 seconds without requiring an app restart.

## User Experience

### Normal Mode (`x: false`)
- Users see live gold prices
- Calculator is fully functional
- All pricing features available

### Maintenance Mode (`x: true`)
- Clear "Under Maintenance" messaging
- Elegant icons and styling
- No broken functionality (gracefully hidden)
- Other app features remain accessible

## Benefits

1. **Remote Control**: Enable/disable pricing without app updates
2. **Graceful Degradation**: App remains usable during maintenance
3. **Clear Communication**: Users know the feature is temporarily unavailable
4. **Quick Toggle**: Changes take effect within seconds
5. **No Data Loss**: Calculator inputs and other data preserved

## API Management

To control maintenance mode, update the `x` field in the stopper API:

```bash
# Example CURL command to enable maintenance
curl --location --request PATCH 'https://admin-pearl-kappa-34.vercel.app/api/stopper/690395d53c64fb216a8b7762' \
--header 'Content-Type: application/json' \
--data '{"x": true}'

# Example CURL command to disable maintenance
curl --location --request PATCH 'https://admin-pearl-kappa-34.vercel.app/api/stopper/690395d53c64fb216a8b7762' \
--header 'Content-Type: application/json' \
--data '{"x": false}'
```
