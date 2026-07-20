import java.sql.*;

public class FixEnrollmentSchema {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://localhost:5432/elearning_db";
        String user = "postgres";
        String pass = "admin123";
        try (Connection c = DriverManager.getConnection(url, user, pass)) {
            c.setAutoCommit(false);
            try (Statement stmt = c.createStatement()) {
                System.out.println("Updating existing student_id values from user_id when needed...");
                int updated = stmt.executeUpdate("UPDATE enrollments SET student_id = user_id WHERE student_id IS NULL AND user_id IS NOT NULL");
                System.out.println("Rows updated: " + updated);
                System.out.println("Dropping foreign key and unique constraints for user_id...");
                stmt.execute("ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS fk3hjx6rcnbmfw368sxigrpfpx0");
                stmt.execute("ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS ukg1muiskd02x66lpy6fqcj6b9q");
                stmt.execute("ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_user_id_not_null");
                System.out.println("Dropping user_id column...");
                stmt.execute("ALTER TABLE enrollments DROP COLUMN IF EXISTS user_id");
                c.commit();
                System.out.println("Schema fix applied successfully.");
            } catch (Exception e) {
                c.rollback();
                throw e;
            }
        }
    }
}
