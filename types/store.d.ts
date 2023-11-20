declare namespace IVStore {
    interface Store {
        id?: number;
        name?: string;
        address?: Address;
        phone?: string;
        color?: string;
        createdAt?: string;
    }

    interface Address {
        street?: string;
        city?: string;
        department?: string;
        country?: string;
    }
}