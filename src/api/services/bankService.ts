// import apiClient from '../client'; // ダミーデータ使用中のためコメントアウト

export interface BankAccount {
  id: number;
  bank_name: string;
  branch_name: string;
  balance: number;
  account_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BankAccountData {
  bank_name: string;
  branch_name: string;
  balance: number;
  account_type?: string;
}

export interface BankAccountDeleteData {
  id: number;
}

export const bankService = {
  getBankAccounts: async (): Promise<BankAccount[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 1,
        bank_name: "三菱UFJ銀行",
        branch_name: "新宿支店",
        balance: 1250000,
        account_type: "普通預金",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        bank_name: "みずほ銀行",
        branch_name: "渋谷支店",
        balance: 850000,
        account_type: "普通預金",
        created_at: "2024-01-20T14:15:00Z",
        updated_at: "2024-01-20T14:15:00Z"
      },
      {
        id: 3,
        bank_name: "三井住友銀行",
        branch_name: "池袋支店",
        balance: 2100000,
        account_type: "定期預金",
        created_at: "2024-02-01T09:45:00Z",
        updated_at: "2024-02-01T09:45:00Z"
      }
    ];
  },
  
  addBankAccount: async (data: BankAccountData): Promise<BankAccount> => {
    // ダミーデータを返す
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: Math.floor(Math.random() * 1000) + 100,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      balance: data.balance,
      account_type: data.account_type || "普通預金",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  
  updateBankAccount: async (id: number, data: BankAccountData): Promise<BankAccount> => {
    // ダミーデータを返す
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      balance: data.balance,
      account_type: data.account_type || "普通預金",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: new Date().toISOString()
    };
  },
  
  deleteBankAccount: async (id: number): Promise<void> => {
    // ダミーデータ対応（削除処理をシミュレート）
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`銀行口座 ID: ${id} を削除しました（ダミー）`);
  }
};

export default bankService;