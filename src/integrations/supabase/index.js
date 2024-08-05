import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### user_table_enquiry

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| id         | bigint                  | number | true     |
| created_at | timestamp with time zone| string | true     |
| last_upd   | timestamp with time zone| string | true     |
| user_id    | text                    | string | true     |
| password   | text                    | string | true     |
| user_type  | text                    | string | true     |
| user_org   | text                    | string | true     |
| created_by | text                    | string | false    |
| last_upd_by| text                    | string | false    |

### user_table

| name            | type                    | format | required |
|-----------------|-------------------------|--------|----------|
| id              | bigint                  | number | true     |
| created_at      | timestamp with time zone| string | true     |
| last_upd        | timestamp with time zone| string | true     |
| user_id         | text                    | string | true     |
| password        | text                    | string | true     |
| user_type       | text                    | string | true     |
| user_org        | text                    | string | true     |
| created_by      | text                    | string | false    |
| last_upd_by     | text                    | string | false    |
| application_name| text[]                  | array  | true     |

### user_org

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| id         | bigint                  | number | true     |
| created_at | timestamp with time zone| string | true     |
| last_upd   | timestamp with time zone| string | true     |
| created_by | text                    | string | true     |
| last_upd_by| text                    | string | true     |
| org_name   | text                    | string | true     |

### dsr_tracker

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| id         | bigint                  | number | true     |
| created_dt | timestamp with time zone| string | true     |
| po_number  | text                    | string | true     |
| last_upd_dt| timestamp with time zone| string | true     |
| last_upd_by| text                    | string | true     |
| created_by | text                    | string | true     |
| comments   | json                    | object | true     |
| user_org   | text                    | string | true     |

### enquiry

| name                | type              | format | required |
|---------------------|-------------------|--------|----------|
| id                  | bigint            | number | true     |
| sno                 | character varying | string | true     |
| created_by          | character varying | string | true     |
| created_date        | date              | string | true     |
| enquiry_id          | character varying | string | true     |
| channel             | character varying | string | true     |
| enquiry_mode        | character varying | string | true     |
| enquiry_type        | character varying | string | true     |
| enquiry_subtype     | character varying | string | true     |
| client              | character varying | string | true     |
| inco_terms          | character varying | string | true     |
| origin_country      | character varying | string | true     |
| origin_port         | character varying | string | true     |
| destination_country | character varying | string | true     |
| destination_port    | character varying | string | true     |
| length              | integer           | number | true     |
| breadth             | integer           | number | true     |
| height              | integer           | number | true     |
| unit_of_measurement | character varying | string | true     |
| package_type        | character varying | string | true     |
| no_of_pkgs          | integer           | number | true     |
| net_weight          | integer           | number | false    |
| total_net           | integer           | number | false    |
| gross_weight        | integer           | number | true     |
| total_gross         | integer           | number | false    |
| equipment           | character varying | string | true     |
| no_of_units         | integer           | number | false    |
| commodity           | character varying | string | true     |
| cargo_readiness     | date              | string | false    |
| cut_off_eta         | date              | string | false    |
| indication_in_usd   | character varying | string | false    |
| remarks             | character varying | string | false    |
| is_assigned         | boolean           | boolean| false    |
| is_deleted          | boolean           | boolean| false    |
| updated_by          | character varying | string | true     |
| updated_date        | date              | string | true     |

### saved_search_enquiry

| name            | type                    | format | required |
|-----------------|-------------------------|--------|----------|
| id              | integer                 | number | true     |
| name            | text                    | string | true     |
| criteria        | jsonb                   | object | true     |
| created_at      | timestamp with time zone| string | false    |
| updated_at      | timestamp with time zone| string | false    |
| user_id         | text                    | string | true     |
| application_name| text                    | string | true     |

*/

// Hooks for user_table_enquiry
export const useUserTableEnquiries = () => useQuery({
    queryKey: ['user_table_enquiries'],
    queryFn: () => fromSupabase(supabase.from('user_table_enquiry').select('*')),
});

export const useAddUserTableEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEnquiry) => fromSupabase(supabase.from('user_table_enquiry').insert([newEnquiry])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_table_enquiries');
        },
    });
};

export const useUpdateUserTableEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_table_enquiry').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_table_enquiries');
        },
    });
};

export const useDeleteUserTableEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_table_enquiry').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_table_enquiries');
        },
    });
};

// Hooks for user_table
export const useUserTables = () => useQuery({
    queryKey: ['user_tables'],
    queryFn: () => fromSupabase(supabase.from('user_table').select('*')),
});

export const useAddUserTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('user_table').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_tables');
        },
    });
};

export const useUpdateUserTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_table').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_tables');
        },
    });
};

export const useDeleteUserTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_table').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_tables');
        },
    });
};

// Hooks for user_org
export const useUserOrgs = () => useQuery({
    queryKey: ['user_orgs'],
    queryFn: () => fromSupabase(supabase.from('user_org').select('*')),
});

export const useAddUserOrg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newOrg) => fromSupabase(supabase.from('user_org').insert([newOrg])),
        onSuccess: () => {
            queryClient.invalidateQueries('user_orgs');
        },
    });
};

export const useUpdateUserOrg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_org').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_orgs');
        },
    });
};

export const useDeleteUserOrg = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_org').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user_orgs');
        },
    });
};

// Hooks for dsr_tracker
export const useDsrTrackers = () => useQuery({
    queryKey: ['dsr_trackers'],
    queryFn: () => fromSupabase(supabase.from('dsr_tracker').select('*')),
});

export const useAddDsrTracker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTracker) => fromSupabase(supabase.from('dsr_tracker').insert([newTracker])),
        onSuccess: () => {
            queryClient.invalidateQueries('dsr_trackers');
        },
    });
};

export const useUpdateDsrTracker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('dsr_tracker').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('dsr_trackers');
        },
    });
};

export const useDeleteDsrTracker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('dsr_tracker').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('dsr_trackers');
        },
    });
};

// Hooks for enquiry
export const useEnquiries = () => useQuery({
    queryKey: ['enquiries'],
    queryFn: () => fromSupabase(supabase.from('enquiry').select('*')),
});

export const useAddEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEnquiry) => fromSupabase(supabase.from('enquiry').insert([newEnquiry])),
        onSuccess: () => {
            queryClient.invalidateQueries('enquiries');
        },
    });
};

export const useUpdateEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('enquiry').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('enquiries');
        },
    });
};

export const useDeleteEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('enquiry').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('enquiries');
        },
    });
};

// Hooks for saved_search_enquiry
export const useSavedSearches = () => useQuery({
    queryKey: ['saved_searches'],
    queryFn: () => fromSupabase(supabase.from('saved_search_enquiry').select('*')),
});

export const useAddSavedSearch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSearch) => fromSupabase(supabase.from('saved_search_enquiry').insert([newSearch])),
        onSuccess: () => {
            queryClient.invalidateQueries('saved_searches');
        },
    });
};

export const useUpdateSavedSearch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('saved_search_enquiry').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('saved_searches');
        },
    });
};

export const useDeleteSavedSearch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('saved_search_enquiry').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('saved_searches');
        },
    });
};
