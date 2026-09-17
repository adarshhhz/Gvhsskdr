import { supabaseAdmin } from '../../lib/supabaseAdmin';

// Creates a new login (student/teacher/admin) with a temporary password.
// SECURITY: this route uses the service_role key, so it must verify
// on the server that the caller is an admin — never trust a role
// claim sent from the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  // Verify the caller's token and look up their role.
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { email, fullName, role, password } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password and role are required' });
  }
  if (!['admin', 'teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || '' },
  });

  if (createError) return res.status(400).json({ error: createError.message });

  // The trigger in schema.sql already created a 'student' profile row —
  // update it to the requested role.
  const { error: roleError } = await supabaseAdmin
    .from('profiles')
    .update({ role, full_name: fullName || '' })
    .eq('id', newUser.user.id);

  if (roleError) return res.status(400).json({ error: roleError.message });

  return res.status(200).json({ success: true, userId: newUser.user.id });
}
