import java.sql.*;

public class TempSchema {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://localhost:5432/elearning_db";
        String user = "postgres";
        String pass = "admin123";
        try (Connection c = DriverManager.getConnection(url, user, pass);
             PreparedStatement ps = c.prepareStatement(
                     "SELECT column_name, is_nullable, data_type, column_default FROM information_schema.columns WHERE table_name='enrollments' ORDER BY ordinal_position");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                System.out.println(rs.getString(1) + " | " + rs.getString(2) + " | " + rs.getString(3) + " | " + rs.getString(4));
            }
        }
    }
}
