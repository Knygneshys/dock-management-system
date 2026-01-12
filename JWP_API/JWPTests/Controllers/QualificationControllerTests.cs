using FluentAssertions;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.QualificationDTOs;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers
{
    [TestFixture]
    public class QualificationControllerTests
    {
        private JWPDbContext _dbContext;
        private QualificationRepository _repository;
        private IMapper _mapper;
        private IQualificationService _service;
        private QualificationsController _controller;
        private QualificationProvider _qualificationProvider;

        [SetUp]
        public void SetUp()
        {
            _dbContext = JwpInMemoryDbContext.GetContext();
            _repository = new QualificationRepository(_dbContext);
            _mapper = new Mapper();
            _service = new QualificationService(_repository, _mapper);

            var mockAuthService = new Mock<IAuthService>();
            mockAuthService.Setup(
                x => x.UserIsAuthorizedByAuth0IdAsync(
                    It.IsAny<string>(),
                    It.IsAny<UserRole>()))
                .ReturnsAsync(true);

            var logger = NullLogger<QualificationsController>.Instance;

            _controller = new QualificationsController(_repository, _mapper, _service, mockAuthService.Object, logger)
            { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
            _qualificationProvider = new QualificationProvider();
        }

        [TearDown]
        public async Task TearDown()
        {
            await _dbContext.DisposeAsync();
        }

        [Test]
        public async Task CreateAsync_ValidQualification_ShouldReturnCreatedId()
        {
            var dto = _qualificationProvider.ProvideDto();

            var result = await _controller.CreateAsync(dto);

            result.Value.Should().NotBe(string.Empty);
            var created = await _dbContext.Qualifications.FirstOrDefaultAsync(q => q.Code == dto.Code);
            created.Should().NotBeNull();
            created!.Name.Should().Be(dto.Name);
        }

        [Test]
        public async Task GetAllAsync_ShouldReturnAllQualifications()
        {
            var qualifications = _qualificationProvider.ProvideList();
            await _dbContext.Qualifications.AddRangeAsync(qualifications);
            await _dbContext.SaveChangesAsync();

            var result = await _controller.GetAllAsync();

            var ok = result.Result as OkObjectResult;
            ok.Should().NotBeNull();
            var list = ok!.Value as List<Qualification>;
            list.Should().HaveCount(3);
        }

        [Test]
        public async Task UpdateAsync_ExistingQualification_ShouldReturnOkAndUpdate()
        {
            var qualification = _qualificationProvider.Provide();
            await _dbContext.Qualifications.AddAsync(qualification);
            await _dbContext.SaveChangesAsync();

            var dto = new UpdateQualificationDTO() { Name = "Updated License"};

            var result = await _controller.UpdateAsync(qualification.Code, dto);

            result.Result.Should().BeOfType<OkObjectResult>();
            var updated = await _dbContext.Qualifications.FirstAsync(q => q.Id == qualification.Id);
            updated.Name.Should().Be("Updated License");
        }

        [Test]
        public async Task UpdateAsync_NonExistingQualification_ShouldReturnNotFound()
        {
            var dto = new UpdateQualificationDTO() { Name = "Ghost"};

            var result = await _controller.UpdateAsync("NewCode123", dto);

            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Test]
        public async Task GetBySearchAsync_ShouldReturnFilteredQualifications()
        {
            var qualifications = new List<Qualification>
            {
                new QualificationProvider().WithCode("PL01").WithName("Pilot License").Provide(),
                new QualificationProvider().WithCode("MC02").WithName("Mechanic Cert").Provide(),
                new QualificationProvider().WithCode("AB03").WithName("Airbridge License").Provide()
            };
            await _dbContext.Qualifications.AddRangeAsync(qualifications);
            await _dbContext.SaveChangesAsync();

            var result = await _controller.GetBySearchAsync("Pilot", null, "contains");

            var ok = result.Result as OkObjectResult;
            ok.Should().NotBeNull();
            var list = ok!.Value as IEnumerable<QualificationDTO>;
            list.Should().HaveCount(1);
        }

        [Test]
        public async Task GetBySearchAsync_InvalidOperatorType_ShouldReturnBadRequest()
        {
            var result = await _controller.GetBySearchAsync("Pilot", null, "invalid");

            result.Result.Should().BeOfType<BadRequestResult>();
        }
    }
}
