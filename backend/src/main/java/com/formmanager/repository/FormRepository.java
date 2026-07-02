package com.formmanager.repository;

import com.formmanager.entity.Form;
import com.formmanager.entity.enums.FormStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    List<Form> findAllByStatusNot(FormStatus status);
    List<Form> findByStatus(FormStatus status);
}
