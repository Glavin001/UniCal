            • User data
                        • How we are going to use this data
                                    • Authenticating user on login.
                                    • Relating a user to other tables (such as Courses), 
                                                • Courses student is presently enrolled in.
                                                • Courses student has previously taken.
                                                • Final Grades for Courses previously taken.
                                                • Course’s teacher(s) -- another type of User -- has taught or is currently teaching.
                        • Potential fields of a User
                                    • A-Number / student number
                                                id, varchar2(9)
                                    • Password / PIN, 
                                                pin, varchar2(256) -> encrypted
                                    • First name, 
                                                first_name, varchar2(60)
                                    • Last name, 
                                                last_name, varchar2(60)
                                                Question: There is also a field for middle name. Do they want this, also?
                                    • Address (current), 
                                                - Just a note here, I’m assuming they would want either the primary address or their current residence address?  I ask because if it’s for some sort of mail-out, there can be a preference to send it to the primary address as opposed
                                                to a residence address.
                                                street_line1/_line2/_line3/_line4: all of these fields are varchar2(75), each
                                                city, varchar2(50)
                                                stat_code, varchar2(3): this is a coded field (state/province). The code descriptions are held in another table and would be varchar2(30).
                                                zip, varchar2(30) (zip, postal)
                                                natn_code, varchar2(5): this is a coded field (nation). The code descriptions are held in another table and would be varchar2(30)
                                                cnty_code, varchar2(5) county code. The code description is in another table and would be varchar2(30).
                                    • Phone number (primary and otherwise),
- Assumption here is they want any active telephone number. There is also the option of only using the number flagged as primary.  So, I’m including the telephone code as a field, so there is a differentiation between home phone, cell, etc. Also, some numbers are flagged as unlisted.
                                                phone_area, varchar2(6)
                                                phone_number, varchar2(12)
                                                phone_ext, varchar2(10)
                                                intl_access, varchar2(16) International access code
                                                tele_coe, varchar2(4): coded field, with descriptions held in another table (CELL, etc), which are type varchar2(30)
                                    • Courses
                                                • Courses enrolled in
                                                                crn, varchar2(5): course reference number (CRN) associated with the class section. It is primarily how we identify classes in Banner.
                                                                Subj_code, varchar2(4), coded field with actual descriptions in another table varchar2(30)
                                                                Crse_numb, varchar2(5)
                                                                Seq_numb, varchar2(3) course section
                                                                Crse_title, varchar2(30)
                                                                Levl_code, varchar2(2): Level code of course (undergrad (UG), graduate (GR), etc). Descriptions are in another table varchar2(30)
                                                • Courses previously taken
                                                                Same as above, but retrieved from different tables
                                                            • Final Grades related to Courses taken
                                                                                Grde_code, varchar2(6)                               
            • Course data
                        • How we are going to use this data
                                    • Display textbooks for courses and look up potential pricing on services such as Amazon
                                    • Automated course registration by balancing a select list of courses the student wishes to take, and creating possible suggested course schedules for students, that are without conflicts.
                        • Potential fields
                                    • Prerequisite(s)
                                                Included in the general course description:
                                                Text_narrative, clob
                                    • Textbook(s) for course
                                                I don’t see this info captured in Banner
                                    • Class schedule (including recitation)
                                                • Start date,
                                                                Start_date, date
                                                • end date
                                                                End_date, date
                                                • class time span (start, end)
                                                                Begin_time, varchar2(4)
                                                                End_time, varchar2(4)
                                                • class days (ex: Tuesday & Thursday?)
                                                                Sun_day,/mon_day, etc: all varchar2(1) each
                                                                May also want to include location info:
                                                                Bldg._code, varchar2(6) with descriptions being varchar2(30)
                                                                Room_code, varchar2(10)
                                    • Professor(s)
                                                Name_prefix, varchar2(20)
                                                First_name, varchar2(60)
                                                Last_name, varchar2(60)
                                    • Year,
                                                Year of study? 1st, 2nd?
                                    • Semester
                                                Term_code, varchar2(6) with description varchar2(30)