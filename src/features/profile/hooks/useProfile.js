import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../api/profileService';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] }); 
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}