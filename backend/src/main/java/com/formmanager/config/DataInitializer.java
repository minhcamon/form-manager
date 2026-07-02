package com.formmanager.config;

import com.formmanager.entity.*;
import com.formmanager.entity.enums.*;
import com.formmanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FormRepository formRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println(">>> Starting database initialization...");

            // 1. Create admin user
            User admin = User.builder()
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullname("Admin System")
                    .role(UserRole.ADMIN)
                    .build();
            admin = userRepository.save(admin);
            System.out.println(">>> Created admin user: admin@example.com");

            // 2. Create regular user
            User user = User.builder()
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullname("Regular User")
                    .role(UserRole.USER)
                    .build();
            userRepository.save(user);
            System.out.println(">>> Created regular user: user@example.com");

            // 3. Create Form 1: Customer Satisfaction Survey
            Form form1 = Form.builder()
                    .title("Khảo sát ý kiến khách hàng")
                    .description("Form khảo sát ý kiến đánh giá về chất lượng sản phẩm và dịch vụ của chúng tôi.")
                    .status(FormStatus.PUBLISHED)
                    .allowMultipleSubmission(true)
                    .createdBy(admin)
                    .build();

            List<FormField> fields1 = new ArrayList<>();

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Họ và tên")
                    .name("fullName")
                    .type(FieldType.TEXT)
                    .required(true)
                    .displayOrder(1)
                    .placeholder("Nhập họ và tên của bạn")
                    .build());

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Email liên hệ")
                    .name("email")
                    .type(FieldType.TEXT)
                    .required(true)
                    .displayOrder(2)
                    .placeholder("Nhập email của bạn")
                    .build());

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Số điện thoại")
                    .name("phone")
                    .type(FieldType.TEXT)
                    .required(false)
                    .displayOrder(3)
                    .placeholder("Nhập số điện thoại (tùy chọn)")
                    .build());

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Đánh giá chất lượng dịch vụ (1-5)")
                    .name("rating")
                    .type(FieldType.NUMBER)
                    .required(true)
                    .displayOrder(4)
                    .placeholder("Nhập số từ 1 đến 5")
                    .build());

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Bạn có giới thiệu sản phẩm của chúng tôi không?")
                    .name("recommend")
                    .type(FieldType.SELECT)
                    .required(true)
                    .displayOrder(5)
                    .optionsJson("[\"Có\", \"Không\"]")
                    .build());

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Màu sắc thương hiệu yêu thích")
                    .name("brandColor")
                    .type(FieldType.COLOR)
                    .required(true)
                    .displayOrder(6)
                    .placeholder("#3b82f6")
                    .build());

            fields1.add(FormField.builder()
                    .form(form1)
                    .label("Góp ý thêm")
                    .name("feedback")
                    .type(FieldType.TEXT)
                    .required(false)
                    .displayOrder(7)
                    .placeholder("Nhập ý kiến đóng góp của bạn...")
                    .build());

            form1.setFields(fields1);
            formRepository.save(form1);
            System.out.println(">>> Created form: Khảo sát ý kiến khách hàng");

            // 4. Create Form 2: Job Application Form
            Form form2 = Form.builder()
                    .title("Đăng ký tuyển dụng")
                    .description("Đăng ký ứng tuyển các vị trí lập trình viên Java, React, PHP tại công ty.")
                    .status(FormStatus.DRAFT)
                    .allowMultipleSubmission(false)
                    .createdBy(admin)
                    .build();

            List<FormField> fields2 = new ArrayList<>();

            fields2.add(FormField.builder()
                    .form(form2)
                    .label("Họ và tên ứng viên")
                    .name("candidateName")
                    .type(FieldType.TEXT)
                    .required(true)
                    .displayOrder(1)
                    .placeholder("Nhập đầy đủ họ tên")
                    .build());

            fields2.add(FormField.builder()
                    .form(form2)
                    .label("Vị trí ứng tuyển")
                    .name("jobPosition")
                    .type(FieldType.SELECT)
                    .required(true)
                    .displayOrder(2)
                    .optionsJson("[\"Java Developer\", \"React Developer\", \"PHP Developer\", \"DevOps Engineer\"]")
                    .build());

            fields2.add(FormField.builder()
                    .form(form2)
                    .label("Mức lương mong muốn (VND)")
                    .name("expectedSalary")
                    .type(FieldType.NUMBER)
                    .required(true)
                    .displayOrder(3)
                    .placeholder("Ví dụ: 15000000")
                    .build());

            fields2.add(FormField.builder()
                    .form(form2)
                    .label("Liên kết CV cá nhân")
                    .name("cvUrl")
                    .type(FieldType.TEXT)
                    .required(true)
                    .displayOrder(4)
                    .placeholder("Nhập link CV (Google Drive, Github, vv.)")
                    .build());

            fields2.add(FormField.builder()
                    .form(form2)
                    .label("Ngày có thể bắt đầu đi làm")
                    .name("startDate")
                    .type(FieldType.DATE)
                    .required(true)
                    .displayOrder(5)
                    .build());

            form2.setFields(fields2);
            formRepository.save(form2);
            System.out.println(">>> Created form: Đăng ký tuyển dụng");

            System.out.println(">>> Database initialization complete!");
        } else {
            System.out.println(">>> Database already contains users. Skipping data initialization.");
        }
    }
}
