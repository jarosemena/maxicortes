using AutoMapper;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.DTOs.Orders;

namespace MaxiCortes.Application.Mappers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Material mappings
        CreateMap<Material, MaterialResponse>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToDisplayString()));

        CreateMap<CreateMaterialRequest, Material>()
            .ConstructUsing(src => new Material(
                src.Name,
                MaterialTypeExtensions.FromString(src.Type),
                new Dimensions(src.Dimensions.Width, src.Dimensions.Height, src.Dimensions.Thickness),
                new Money(src.CostPerUnit.Amount, src.CostPerUnit.Currency),
                src.StockQuantity));

        // Order mappings
        CreateMap<Order, OrderResponse>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.CalculateTotal()))
            .ForMember(dest => dest.TotalItemCount, opt => opt.MapFrom(src => src.GetTotalItemCount()));

        CreateMap<OrderItem, OrderItemResponse>()
            .ForMember(dest => dest.MaterialName, opt => opt.MapFrom(src => src.Material.Name))
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()))
            .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.CalculateSubtotal()))
            .ForMember(dest => dest.TotalArea, opt => opt.MapFrom(src => src.CalculateTotalArea()));

        // Value Object mappings
        CreateMap<Dimensions, DimensionsDto>().ReverseMap();
        CreateMap<Money, MoneyDto>().ReverseMap();
        CreateMap<Point, PointDto>().ReverseMap();

        // Geometry mappings
        CreateMap<Geometry, GeometryDto>()
            .Include<Polygon, PolygonDto>()
            .Include<Circle, CircleDto>()
            .Include<Oval, OvalDto>();

        CreateMap<Polygon, PolygonDto>();
        CreateMap<Circle, CircleDto>();
        CreateMap<Oval, OvalDto>();

        CreateMap<GeometryDto, Geometry>()
            .Include<PolygonDto, Polygon>()
            .Include<CircleDto, Circle>()
            .Include<OvalDto, Oval>();

        CreateMap<PolygonDto, Polygon>()
            .ConstructUsing(src => new Polygon(src.Points.Select(p => new Point(p.X, p.Y))));

        CreateMap<CircleDto, Circle>()
            .ConstructUsing(src => new Circle(new Point(src.Center.X, src.Center.Y), src.Radius));

        CreateMap<OvalDto, Oval>()
            .ConstructUsing(src => new Oval(new Point(src.Center.X, src.Center.Y), src.RadiusX, src.RadiusY));

        // Priority enum mapping
        CreateMap<Priority, string>().ConvertUsing(src => src.ToString());
        CreateMap<string, Priority>().ConvertUsing(src => Enum.Parse<Priority>(src, true));
    }
}