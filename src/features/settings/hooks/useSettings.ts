import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, type GlobalSettings, type BrandingSettings, type SecuritySettings } from '../api/settingsService';

export function useGlobalSettings() {
  return useQuery({
    queryKey: ['settings-global'],
    queryFn: () => settingsService.getGlobalSettings(),
  });
}

export function useUpdateGlobalSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GlobalSettings) => settingsService.updateGlobalSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings-global'] }),
  });
}

export function useBrandingSettings() {
  return useQuery({
    queryKey: ['settings-branding'],
    queryFn: () => settingsService.getBrandingSettings(),
  });
}

export function useUpdateBrandingSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BrandingSettings) => settingsService.updateBrandingSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings-branding'] }),
  });
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['settings-security'],
    queryFn: () => settingsService.getSecuritySettings(),
  });
}

export function useUpdateSecuritySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SecuritySettings) => settingsService.updateSecuritySettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings-security'] }),
  });
}

export function useIntegrations() {
  return useQuery({
    queryKey: ['settings-integrations'],
    queryFn: () => settingsService.getIntegrations(),
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ['settings-audit-logs'],
    queryFn: () => settingsService.getAuditLogs(),
  });
}