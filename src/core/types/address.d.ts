export type Address = {
  id: number;
  title: string;
  phoneNumber: string;
  name: string;
  address: string;
};

// Use this when creating a new address (without id)
export type NewAddress = Omit<Address, "id">;
