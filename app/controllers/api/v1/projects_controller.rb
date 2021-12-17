module Api
	module V1
		class ProjectsController < ApplicationController
			protect_from_forgery with: :null_session
				
			def index
				projects = Project.all
				
				render json: projects.to_json(only: [:name, :id])
			end

			def show
				project = Project.find_by(id: params[:id])

				render json: project
			end

			def create
				project = Project.new(project_params)
        if project.save

					render json: project
        else
          render json: { error: project.errors.messages }, status: 422
        end
			end

			def update
        project = Project.find_by(id: params[:id])
        if project.update(project_params)

					render json: project
        else
          render json: { error: project.errors.messages }, status: 422
        end
      end

			def destroy
        project = Project.find_by(id: params[:id])
        if project.destroy
          head :no_content
        else
          render json: { errors: project.errors }, status: 422
        end
      end
			
			private

			def project_params
				params.require(:project).permit(:id, :name, :user_id)
			end

		end
	end
end