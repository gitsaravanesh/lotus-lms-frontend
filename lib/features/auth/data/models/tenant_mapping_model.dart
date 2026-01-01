import 'package:json_annotation/json_annotation.dart';

part 'tenant_mapping_model.g.dart';

/// Tenant Mapping Model
@JsonSerializable()
class TenantMappingModel {
  @JsonKey(name: 'user_id')
  final String userId;
  
  @JsonKey(name: 'tenant_id')
  final String tenantId;
  
  final String role;
  final String email;
  
  @JsonKey(name: 'created_at')
  final String? createdAt;
  
  const TenantMappingModel({
    required this.userId,
    required this.tenantId,
    required this.role,
    required this.email,
    this.createdAt,
  });
  
  factory TenantMappingModel.fromJson(Map<String, dynamic> json) =>
      _$TenantMappingModelFromJson(json);
  
  Map<String, dynamic> toJson() => _$TenantMappingModelToJson(this);
}
