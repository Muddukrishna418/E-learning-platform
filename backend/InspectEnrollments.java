import java.sql.*;

public class InspectEnrollments {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://localhost:5432/elearning_db";
        String user = "postgres";
        String pass = "admin123";
        try (Connection c = DriverManager.getConnection(url, user, pass)) {
            System.out.println("--- columns ---");
            try (PreparedStatement ps = c.prepareStatement(
                    "SELECT column_name, is_nullable, data_type, column_default FROM information_schema.columns WHERE table_name='enrollments' ORDER BY ordinal_position")) {
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        System.out.println(rs.getString(1) + " | " + rs.getString(2) + " | " + rs.getString(3) + " | " + rs.getString(4));
                    }
                }
            }
            System.out.println("--- sample rows ---");
            try (PreparedStatement ps = c.prepareStatement(
                    "SELECT id, student_id, user_id, course_id, enrolled_at FROM enrollments ORDER BY id LIMIT 10")) {
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        System.out.println(rs.getLong("id") + " | " + rs.getLong("student_id") + " | " + rs.getLong("user_id") + " | " + rs.getLong("course_id") + " | " + rs.getTimestamp("enrolled_at"));
                    }
                }
            }
        }
    }
}
