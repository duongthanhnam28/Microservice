package com.thanhnam.userservice.command.data;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CHUCVU")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaChucVu")
    private Integer maCV;
    @Column(name = "TenChucVu")
    private String tenChucVu;
} 