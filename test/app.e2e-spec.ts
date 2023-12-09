import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
			}),
		);

		const port = 3333;
		await app.init();
		await app.listen(port);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();

		pactum.request.setBaseUrl('http://localhost:' + port);
	});

	afterAll(() => {
		app.close();
	});

	describe('Auth', () => {
		const dto: AuthDto = {
			email: 'vlad@gmail.com',
			password: '123',
		};

		describe('Signup', () => {
			it('Should throw if email empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						password: dto.password,
					})
					.expectStatus(400);
			});

			it('Should throw if password empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						email: dto.email,
					})
					.expectStatus(400);
			});

			it('Should throw if no body', () => {
				return pactum.spec().post('/auth/signup').expectStatus(400);
			});

			it('Should signup', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody(dto)
					.expectStatus(201);
			});
		});

		describe('Signin', () => {
			it('Should throw if email empty', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						password: dto.password,
					})
					.expectStatus(400);
			});

			it('Should throw if password empty', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						email: dto.email,
					})
					.expectStatus(400);
			});

			it('Should throw if no body', () => {
				return pactum.spec().post('/auth/signin').expectStatus(400);
			});

			it('Should signin', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody(dto)
					.expectStatus(200)
					.stores('userAt', 'access_token');
			});
		});
	});

	describe('User', () => {
		describe('Get me', () => {
			it('Should get current user', () => {
				return pactum
					.spec()
					.get('/users/me')
					.withBearerToken('$S{userAt}')
					.expectStatus(200);
			});
		});

		describe('Edit user', () => {
			it('Should edit user', () => {
				const dto: EditUserDto = {
					firstName: 'Vladimir',
					email: 'jamesdevnow@gmail.com',
				};

				return pactum
					.spec()
					.patch('/users')
					.withBearerToken('$S{userAt}')
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName)
					.expectBodyContains(dto.email);
			});
		});
	});

	describe('Bookmarks', () => {
		describe('Create bookmark', () => {});

		describe('Get bookmarks', () => {});

		describe('Get bookmark by id', () => {});

		describe('Edit bookmark by id', () => {});

		describe('Delete bookmark', () => {});
	});
});
