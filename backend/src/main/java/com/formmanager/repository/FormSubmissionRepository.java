package com.formmanager.repository;

import com.formmanager.entity.FormSubmission;
import com.formmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
    List<FormSubmission> findBySubmittedBy(User user);
}
