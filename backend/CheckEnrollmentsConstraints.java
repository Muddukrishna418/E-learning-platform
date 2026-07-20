import java.sql.*;

public class CheckEnrollmentsConstraints {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://localhost:5432/elearning_db";
        String user = "postgres";
        String pass = "admin123";
        try (Connection c = DriverManager.getConnection(url, user, pass)) {
            System.out.println("--- constraints ---");
            String sql = "SELECT conname, contype, pg_get_constraintdef(oid) " +
                         "FROM pg_constraint WHERE conrelid = 'enrollments'::regclass";
            try (PreparedStatement ps = c.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    System.out.println(rs.getString(1) + " | " + rs.getString(2) + " | " + rs.getString(3));
                }
            }
        }
    }
}
