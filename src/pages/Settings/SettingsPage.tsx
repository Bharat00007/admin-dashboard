import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { 
    globalSettings, 
    isLoadingSettings, 
    loadGlobalSettings, 
    updateGlobalSettings 
  } = useApp();

  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(500);
  const [deliveryChargeRupees, setDeliveryChargeRupees] = useState<number>(30);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadGlobalSettings();
  }, [loadGlobalSettings]);

  useEffect(() => {
    if (globalSettings) {
      setSearchRadiusKm(globalSettings.universalSearchRadiusKm);
      setDeliveryChargeRupees(globalSettings.globalDeliveryChargePaise / 100);
      setHasChanges(false);
    }
  }, [globalSettings]);

  const handleRadiusChange = (val: number) => {
    setSearchRadiusKm(val);
    setHasChanges(true);
  };

  const handleDeliveryChange = (val: number) => {
    setDeliveryChargeRupees(val);
    setHasChanges(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRadiusKm < 1 || deliveryChargeRupees < 0) return;

    setIsSaving(true);
    try {
      const success = await updateGlobalSettings({
        universalSearchRadiusKm: Number(searchRadiusKm),
        globalDeliveryChargePaise: Math.round(Number(deliveryChargeRupees) * 100),
      });
      if (success) {
        setHasChanges(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (globalSettings) {
      setSearchRadiusKm(globalSettings.universalSearchRadiusKm);
      setDeliveryChargeRupees(globalSettings.globalDeliveryChargePaise / 100);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Global Platform Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Configure system-wide parameters, default fulfillment charges, and buyer discovery thresholds.
          </p>
        </div>
        <Button
          variant="secondary"
          icon="refresh"
          onClick={() => loadGlobalSettings()}
          disabled={isLoadingSettings}
        >
          {isLoadingSettings ? 'Syncing...' : 'Sync Settings'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Fulfillment & Delivery Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Delivery &amp; Logistics Configuration
              </h2>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                Default delivery fee structure charged to consumers when merchant overrides are omitted.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-1">
                Global Delivery Charge (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-[15px]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={deliveryChargeRupees}
                  onChange={(e) => handleDeliveryChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-semibold text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1.5">
                Stored in production backend as <code className="bg-surface-container-high px-1 py-0.5 rounded font-mono text-[11px]">{Math.round(deliveryChargeRupees * 100)} paise</code>.
              </p>
            </div>

            <div className="bg-surface-container-low/50 p-3.5 rounded-xl border border-outline-variant/20 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Current Production Setting
              </span>
              <p className="text-xl font-bold text-on-surface mt-1">
                ₹{globalSettings?.globalDeliveryChargeRupees || (deliveryChargeRupees).toFixed(2)}
              </p>
              <span className="text-[11px] text-outline mt-0.5">
                Applies to all standard customer checkouts
              </span>
            </div>
          </div>
        </div>

        {/* Discovery & Geofencing Parameters */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">radar</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Discovery &amp; Geofencing Parameters
              </h2>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                Controls the maximum geographical radius for buyer search matching and outlet recommendations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-1">
                Universal Search Radius (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  required
                  value={searchRadiusKm}
                  onChange={(e) => handleRadiusChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-semibold text-on-surface focus:border-primary focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[12px] font-semibold">
                  km
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1.5">
                Outlets beyond this radius will not appear in universal product search feeds.
              </p>
            </div>

            <div className="bg-surface-container-low/50 p-3.5 rounded-xl border border-outline-variant/20 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Geofence Radius
              </span>
              <p className="text-xl font-bold text-on-surface mt-1">
                {globalSettings?.universalSearchRadiusKm || searchRadiusKm} km
              </p>
              <span className="text-[11px] text-outline mt-0.5">
                Universal search boundary threshold
              </span>
            </div>
          </div>
        </div>

        {/* Configuration Audit Metadata Card */}
        <div className="bg-surface-container-low/40 rounded-xl p-4 border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-outline">info</span>
            <span>
              Config Key: <code className="font-mono font-semibold text-on-surface">{globalSettings?.key || 'GLOBAL_CONFIG'}</code>
            </span>
          </div>
          <div>
            Last synced with production: <span className="font-medium text-on-surface">{globalSettings?.updatedAt || 'Just now'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {hasChanges && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isSaving}
            >
              Discard Changes
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            icon="save"
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? 'Saving to Production...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
};
