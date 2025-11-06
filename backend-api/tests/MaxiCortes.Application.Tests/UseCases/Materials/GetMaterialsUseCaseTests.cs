using AutoMapper;
using FluentAssertions;
using MaxiCortes.Application.DTOs.Common;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Mappers;
using MaxiCortes.Application.UseCases.Materials;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using Moq;
using Xunit;

namespace MaxiCortes.Application.Tests.UseCases.Materials;

public class GetMaterialsUseCaseTests
{
    private readonly Mock<IMaterialRepository> _mockRepository;
    private readonly IMapper _mapper;
    private readonly GetMaterialsUseCase _useCase;

    public GetMaterialsUseCaseTests()
    {
        _mockRepository = new Mock<IMaterialRepository>();
        
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
        
        _useCase = new GetMaterialsUseCase(_mockRepository.Object, _mapper);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidPagination_ShouldReturnPaginatedResults()
    {
        // Arrange
        var materials = CreateTestMaterials();
        var totalCount = 25;
        var skip = 0;
        var take = 10;

        _mockRepository
            .Setup(r => r.GetPagedAsync(skip, take, null, null, null, null, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync((materials.Take(take), totalCount));

        // Act
        var pagination = new PaginationRequest { PageNumber = 1, PageSize = take };
        var result = await _useCase.ExecuteAsync(pagination);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(take);
        result.TotalCount.Should().Be(totalCount);
        result.PageSize.Should().Be(take);
        result.PageNumber.Should().Be(1);
        result.TotalPages.Should().Be(3); // 25 / 10 = 3 pages

        _mockRepository.Verify(r => r.GetPagedAsync(skip, take, null, null, null, null, false, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithFilter_ShouldApplyFiltersCorrectly()
    {
        // Arrange
        var materials = CreateTestMaterials();
        var filter = new MaterialFilterRequest
        {
            Type = "Wood",
            IsActive = true,
            SearchTerm = "Test",
            SortBy = "Name",
            SortDescending = false
        };

        _mockRepository
            .Setup(r => r.GetPagedAsync(0, 10, filter.SearchTerm, MaterialType.Wood, filter.IsActive, filter.SortBy, filter.SortDescending, It.IsAny<CancellationToken>()))
            .ReturnsAsync((materials, materials.Count()));

        // Act
        var pagination = new PaginationRequest { PageNumber = 1, PageSize = 10 };
        var result = await _useCase.ExecuteAsync(pagination, filter);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().NotBeEmpty();

        _mockRepository.Verify(r => r.GetPagedAsync(0, 10, filter.SearchTerm, MaterialType.Wood, filter.IsActive, filter.SortBy, filter.SortDescending, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(-1, 0)]
    [InlineData(1, -1)]
    [InlineData(1, 101)] // Assuming max page size is 100
    public async Task ExecuteAsync_WithInvalidPagination_ShouldNormalizePagination(int pageNumber, int pageSize)
    {
        // Arrange
        var materials = CreateTestMaterials();
        var pagination = new PaginationRequest { PageNumber = pageNumber, PageSize = pageSize };

        _mockRepository
            .Setup(r => r.GetPagedAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<MaterialType?>(), It.IsAny<bool?>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((materials, materials.Count()));

        // Act
        var result = await _useCase.ExecuteAsync(pagination);

        // Assert
        result.Should().NotBeNull();
        result.PageNumber.Should().BeGreaterOrEqualTo(1);
        result.PageSize.Should().BeInRange(1, 100);
    }

    [Fact]
    public async Task ExecuteAsync_WithInvalidMaterialType_ShouldIgnoreTypeFilter()
    {
        // Arrange
        var materials = CreateTestMaterials();
        var filter = new MaterialFilterRequest
        {
            Type = "InvalidType",
            SortBy = "Name"
        };

        _mockRepository
            .Setup(r => r.GetPagedAsync(0, 10, null, null, null, "Name", false, It.IsAny<CancellationToken>()))
            .ReturnsAsync((materials, materials.Count()));

        // Act
        var pagination = new PaginationRequest { PageNumber = 1, PageSize = 10 };
        var result = await _useCase.ExecuteAsync(pagination, filter);

        // Assert
        result.Should().NotBeNull();
        _mockRepository.Verify(r => r.GetPagedAsync(0, 10, null, null, null, "Name", false, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithRepositoryException_ShouldPropagateException()
    {
        // Arrange
        var expectedException = new InvalidOperationException("Database error");
        _mockRepository
            .Setup(r => r.GetPagedAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<MaterialType?>(), It.IsAny<bool?>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        var pagination = new PaginationRequest { PageNumber = 1, PageSize = 10 };
        await _useCase.Invoking(x => x.ExecuteAsync(pagination))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Database error");
    }

    [Fact]
    public void Constructor_WithNullRepository_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new GetMaterialsUseCase(null!, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("materialRepository");
    }

    [Fact]
    public void Constructor_WithNullMapper_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new GetMaterialsUseCase(_mockRepository.Object, null!);
        act.Should().Throw<ArgumentNullException>().WithParameterName("mapper");
    }

    [Fact]
    public async Task ExecuteAsync_WithEmptyResults_ShouldReturnEmptyPaginatedResponse()
    {
        // Arrange
        var emptyMaterials = Enumerable.Empty<Material>();
        _mockRepository
            .Setup(r => r.GetPagedAsync(0, 10, null, null, null, null, false, It.IsAny<CancellationToken>()))
            .ReturnsAsync((emptyMaterials, 0));

        // Act
        var pagination = new PaginationRequest { PageNumber = 1, PageSize = 10 };
        var result = await _useCase.ExecuteAsync(pagination);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().BeEmpty();
        result.TotalCount.Should().Be(0);
        result.TotalPages.Should().Be(0);
    }

    private static IEnumerable<Material> CreateTestMaterials()
    {
        var materials = new List<Material>();
        
        for (int i = 1; i <= 15; i++) // Crear más materiales para los tests
        {
            var material = new Material(
                $"Test Material {i}",
                MaterialType.Wood,
                new Dimensions(100 + i, 200 + i, 5),
                new Money(50.00m + i),
                10 + i
            );
            materials.Add(material);
        }

        return materials;
    }
}