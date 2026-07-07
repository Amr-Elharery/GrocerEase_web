import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, type UpdateProfilePayload, type UserProfile } from "../api/profileService";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) =>
      profileService.updateProfile(data),

    onSuccess: (_data, variables) => {
      qc.setQueryData<UserProfile>(["profile"], (old) =>
        old ? { ...old, ...variables } : old
      );
    },
  });
}