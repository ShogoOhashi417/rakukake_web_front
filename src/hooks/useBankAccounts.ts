import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { bankService, BankAccount, BankAccountData } from '../api/services/bankService';

export const useBankAccounts = (): UseQueryResult<BankAccount[], Error> => {
  return useQuery({
    queryKey: ['bankAccounts'],
    queryFn: bankService.getBankAccounts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddBankAccount = (): UseMutationResult<BankAccount, Error, BankAccountData> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bankService.addBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
};

interface UpdateBankAccountParams {
  accountId: number;
  bankAccountData: BankAccountData;
}

export const useUpdateBankAccount = (): UseMutationResult<BankAccount, Error, UpdateBankAccountParams> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ accountId, bankAccountData }: UpdateBankAccountParams) => 
      bankService.updateBankAccount(accountId, bankAccountData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
};

export const useDeleteBankAccount = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bankService.deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
};