-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ==================== PROFILES POLICIES ====================

-- Admin can do everything
CREATE POLICY "admin_full_access_profiles" ON public.profiles
  FOR ALL USING (public.get_user_role() = 'admin');

-- Teachers can view all profiles (to see students)
CREATE POLICY "teacher_select_profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role() = 'teacher');

-- Students can only view their own profile
CREATE POLICY "student_select_own_profile" ON public.profiles
  FOR SELECT USING (
    public.get_user_role() = 'student' AND id = auth.uid()
  );

-- Students can update their own profile (limited fields via app logic)
CREATE POLICY "student_update_own_profile" ON public.profiles
  FOR UPDATE USING (
    public.get_user_role() = 'student' AND id = auth.uid()
  );

-- ==================== CLASSES POLICIES ====================

-- Admin can do everything with classes
CREATE POLICY "admin_full_access_classes" ON public.classes
  FOR ALL USING (public.get_user_role() = 'admin');

-- Teachers and students can view classes
CREATE POLICY "authenticated_select_classes" ON public.classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ==================== SUBJECTS POLICIES ====================

-- Admin can do everything with subjects
CREATE POLICY "admin_full_access_subjects" ON public.subjects
  FOR ALL USING (public.get_user_role() = 'admin');

-- Everyone authenticated can view subjects
CREATE POLICY "authenticated_select_subjects" ON public.subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ==================== CLASS_SUBJECTS POLICIES ====================

-- Admin can do everything
CREATE POLICY "admin_full_access_class_subjects" ON public.class_subjects
  FOR ALL USING (public.get_user_role() = 'admin');

-- Everyone authenticated can view class subjects
CREATE POLICY "authenticated_select_class_subjects" ON public.class_subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ==================== RESULTS POLICIES ====================

-- Admin can do everything with results
CREATE POLICY "admin_full_access_results" ON public.results
  FOR ALL USING (public.get_user_role() = 'admin');

-- Teachers can view results for their assigned classes
CREATE POLICY "teacher_select_results" ON public.results
  FOR SELECT USING (
    public.get_user_role() = 'teacher' AND
    EXISTS (
      SELECT 1 FROM public.teacher_assignments ta
      WHERE ta.teacher_id = auth.uid()
      AND ta.class_id = results.class_id
      AND ta.subject_id = results.subject_id
    )
  );

-- Teachers can insert results for their assigned classes
CREATE POLICY "teacher_insert_results" ON public.results
  FOR INSERT WITH CHECK (
    public.get_user_role() = 'teacher' AND
    EXISTS (
      SELECT 1 FROM public.teacher_assignments ta
      WHERE ta.teacher_id = auth.uid()
      AND ta.class_id = results.class_id
      AND ta.subject_id = results.subject_id
    )
  );

-- Teachers can update results they created
CREATE POLICY "teacher_update_results" ON public.results
  FOR UPDATE USING (
    public.get_user_role() = 'teacher' AND
    created_by = auth.uid()
  );

-- Students can only view their own results
CREATE POLICY "student_select_own_results" ON public.results
  FOR SELECT USING (
    public.get_user_role() = 'student' AND student_id = auth.uid()
  );

-- ==================== ANNOUNCEMENTS POLICIES ====================

-- Admin can do everything with announcements
CREATE POLICY "admin_full_access_announcements" ON public.announcements
  FOR ALL USING (public.get_user_role() = 'admin');

-- Teachers can create and manage their own announcements
CREATE POLICY "teacher_insert_announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    public.get_user_role() = 'teacher' AND author_id = auth.uid()
  );

CREATE POLICY "teacher_update_own_announcements" ON public.announcements
  FOR UPDATE USING (
    public.get_user_role() = 'teacher' AND author_id = auth.uid()
  );

CREATE POLICY "teacher_delete_own_announcements" ON public.announcements
  FOR DELETE USING (
    public.get_user_role() = 'teacher' AND author_id = auth.uid()
  );

-- Everyone can view announcements targeted to them
CREATE POLICY "view_targeted_announcements" ON public.announcements
  FOR SELECT USING (
    is_active = true AND (
      target = 'all' OR
      (target = 'students' AND public.get_user_role() = 'student') OR
      (target = 'teachers' AND public.get_user_role() = 'teacher') OR
      (target = 'admins' AND public.get_user_role() = 'admin')
    )
  );

-- ==================== TEACHER_ASSIGNMENTS POLICIES ====================

-- Admin can do everything
CREATE POLICY "admin_full_access_teacher_assignments" ON public.teacher_assignments
  FOR ALL USING (public.get_user_role() = 'admin');

-- Teachers can view their own assignments
CREATE POLICY "teacher_select_own_assignments" ON public.teacher_assignments
  FOR SELECT USING (
    public.get_user_role() = 'teacher' AND teacher_id = auth.uid()
  );
