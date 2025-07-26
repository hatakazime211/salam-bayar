-- Create test users for each role
DO $$
DECLARE
    admin_user_id uuid;
    staff_user_id uuid;
    parent_user_id uuid;
BEGIN
    -- Insert test admin user profile
    INSERT INTO public.profiles (user_id, full_name, role, phone)
    VALUES (
        'admin-test-user-id-1234567890123456'::uuid,
        'Admin Test User',
        'admin'::user_role,
        '+6281234567890'
    );

    -- Insert test staff user profile  
    INSERT INTO public.profiles (user_id, full_name, role, phone)
    VALUES (
        'staff-test-user-id-1234567890123456'::uuid,
        'Staff Test User', 
        'staff'::user_role,
        '+6281234567891'
    );

    -- Insert test parent user profile
    INSERT INTO public.profiles (user_id, full_name, role, phone)
    VALUES (
        'parent-test-user-id-1234567890123456'::uuid,
        'Parent Test User',
        'parent'::user_role, 
        '+6281234567892'
    );

    -- Create a test student linked to the parent
    INSERT INTO public.students (
        nis, name, class, academic_year, monthly_fee, parent_id
    ) VALUES (
        'NIS001',
        'Test Student 1',
        '10A',
        '2024/2025',
        500000,
        (SELECT id FROM public.profiles WHERE user_id = 'parent-test-user-id-1234567890123456'::uuid)
    );

    -- Create test payments
    INSERT INTO public.payments (
        student_id, month_year, amount, due_date, status, payment_method
    ) VALUES (
        (SELECT id FROM public.students WHERE nis = 'NIS001'),
        'January 2024',
        500000,
        '2024-01-15'::date,
        'paid'::payment_status,
        'transfer'::payment_method
    );

    RAISE NOTICE 'Test users and data created successfully';
END $$;